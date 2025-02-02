import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { requestDelete, requestPost } from '../services/request';
import MyContext from './MyContext';
import { useHistory } from 'react-router-dom';

function Provider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoginDisabled, toggleLoginButton] = useState(true);
  const [isRegisterDisabled, toggleRegisterButton] = useState(true);
  const [failedTryLogin, setFailedTryLogin] = useState(false);
  const [failedTryRegister, setFailedTryRegister] = useState(false);
  const [formsInfo, setFormsInfo] = useState({
    loginEmailInput: '',
    loginPasswordInput: '',
    registerNameInput: '',
    registerEmailInput: '',
    registerPasswordInput: '',
  });

  const history = useHistory();

  const handleChange = useCallback(
    ({ target }) => {
      const auxValues = { ...formsInfo };
      auxValues[target.name] = target.value;
      setFormsInfo(auxValues);
    },
    [formsInfo],
  );

  const validateLoginInputs = useCallback(() => {
    const { loginEmailInput, loginPasswordInput } = formsInfo;
    const Regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/gi;
    const verifyEmail = Regex.test(loginEmailInput);
    const six = 6;
    const verifyUser = loginPasswordInput.length >= six;
    toggleLoginButton(!(verifyEmail && verifyUser));
  }, [formsInfo]);

  const validateRegisterInputs = useCallback(() => {
    const { registerEmailInput, registerPasswordInput } = formsInfo;
    const Regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/gi;
    const verifyEmail = Regex.test(registerEmailInput);
    const six = 6;
    const verifyUser = registerPasswordInput.length >= six;
    toggleRegisterButton(!(verifyEmail && verifyUser));
  }, [formsInfo]);

  const resetInputs = useCallback(() => {
    setFormsInfo({
      loginEmailInput: '',
      loginPasswordInput: '',
      registerNameInput: '',
      registerEmailInput: '',
      registerPasswordInput: '',
    });
  }, []);

  const login = useCallback(async (event, info) => {
    event.preventDefault();
    try {
      const user = await requestPost('/login', info);
      const { id, ...userInfo } = user;
      const userData = {
        ...userInfo,
        userId: id,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLogged(true);
    } catch (error) {
      setFailedTryLogin(true);
    }
  }, []);

  const register = useCallback(async (event, info) => {
      event.preventDefault();
      try {
        const user = await requestPost('/register', info);
        const { id, ...userInfo } = user;
        const userData = {
          ...userInfo,
          userId: id,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLogged(true);
      } catch (error) {
        setFailedTryRegister(true);
      }
    },
    [],
  );

  const logOut = useCallback(async () => {
    try {
      localStorage.clear();
      setIsLogged(false);
      history.push('/login');
    } catch (error) {
      setIsLogged(false);
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    try {
      const { token } = JSON.parse(localStorage.getItem('user'));
      const headers = {
        headers: {
          Authorization: token,
        },
      };
      await requestDelete(`/posts/${id}`, headers);
      history.push('/posts')
    } catch (error) {
      console.log(error.message);
    }
  }, [history]);

  useEffect(() => {
    validateLoginInputs();
    validateRegisterInputs();
  }, [validateLoginInputs, validateRegisterInputs]);

  const contextValue = useMemo(
    () => ({
      handleChange,
      setFormsInfo,
      resetInputs,
      login,
      setIsLogged,
      register,
      logOut,
      formsInfo,
      isLogged,
      isLoginDisabled,
      isRegisterDisabled,
      failedTryLogin,
      failedTryRegister,
      deletePost,
    }),
    [
      handleChange,
      resetInputs,
      login,
      register,
      logOut,
      deletePost,
      formsInfo,
      isLogged,
      isLoginDisabled,
      isRegisterDisabled,
      failedTryLogin,
      failedTryRegister
    ]
  );

  return (
    <MyContext.Provider value={ contextValue }>{children}</MyContext.Provider>
  );
}

export default Provider;