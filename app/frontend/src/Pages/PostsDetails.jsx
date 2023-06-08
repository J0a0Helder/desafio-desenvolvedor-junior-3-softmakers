import React, { useEffect, useState, useContext } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import { requestGet } from '../services/request';
import MyContext from '../context/MyContext';
import { convertDate } from '../utils/convertData';
import NavBar from '../Components/NavBar';

const PostsDetails = () => {
  const { isLogged, deletePost } = useContext(MyContext);
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const userInfos = JSON.parse(localStorage.getItem('user'));

  const history = useHistory();

  useEffect(() => {
    const getPostById = async () => {
      try {
        const { token } = userInfos;
        const headers = {
          headers: {
            Authorization: token,
          },
        };
        const silglePost = await requestGet(`/posts/${id}`, headers);
        setPost(silglePost);
      } catch (error) {
        localStorage.clear();
        return <Redirect to="/notfound" />
      }
    };
    getPostById();
  }, [id, userInfos]);

  if (!isLogged) return <Redirect to="/login" />
  if (!post) return <div>Carregando detalhes da postagem...</div>;
  const { userId } = userInfos

  return (
    <>
      <NavBar />
      <div>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <p>Publicado em: {convertDate(post.published)}</p>
        {
          post.updated !== null && <p>{`Editado em: ${convertDate(post.updated)}`}</p>
        }
        <p>Publicado por: {post.user.name}</p>
        {
          userId === post.user.id && (
            <>
              <button
                type="button"
                onClick={ () => history.push(`/editpost/${id}`) }
              >
                Editar Postagem
              </button>
              <button
                type="button"
                onClick={ () => deletePost(id) }
              >
                Deletar Postagem
              </button>
            </>
          )
        }
      </div>
    </>
  );
};

export default PostsDetails;