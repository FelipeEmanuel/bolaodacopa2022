import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner.jsx'
import PalpiteItem from '../components/PalpiteItem'
import { useState } from 'react'
import '../components/PalpiteItem/palpiteItem.css'

import { get } from '../api'
import {ordenarJogos} from '../components/utils'
import ListaPalpites from '../components/ListaPalpites/index.jsx'
import Header from '../components/Header/Header.jsx'


function Dashboard() {

  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()
  
  useEffect(() => {
    if(!user) {
      navigate('/login')
    }

  }, [user, navigate])

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [games, setGames] = useState(null)
  const [palpitou, setPalpitou] = useState(null)

  useEffect(() => {
    get("api/palpites", setData, setError, setIsFetching)
  }, [palpitou])

  useEffect(() => { 
    if(data) {
      data?.user?.forEach(u => {   
          u.palpites.forEach(p => {
            p.pontuacao = 0;
            data?.gamesTodos?.forEach(g => {
              if(p.jogo === g._id) {
                p.jogoObj = g;
                if(p.palpite1 === g.placar1 && p.palpite2 === g.placar2){
                  if(g.gameType === 2) {
                    p.pontuacao = p.pontuacao + 10;
                  } else {
                    p.pontuacao = p.pontuacao + 5;
                  }   
                } else if((p.palpite1 > p.palpite2 && g.placar1 > g.placar2) || (p.palpite1 < p.palpite2 && g.placar1 < g.placar2)) {  
                  if(g.gameType === 2) {
                    p.pontuacao = p.pontuacao + 6;
                  } else {
                    p.pontuacao = p.pontuacao + 3;
                  }
                  if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                    if(g.gameType === 2) {
                      p.pontuacao = p.pontuacao + 2;
                    } else {
                      p.pontuacao = p.pontuacao + 1;
                    }              
                  } 
                } else if(g.placar1 !== "" && g.placar2 !== "" && p.palpite1 === p.palpite2 && g.placar1 === g.placar2) {
                  if(g.gameType === 2) {
                    p.pontuacao = p.pontuacao + 6;
                  } else {
                    p.pontuacao = p.pontuacao + 3;
                  }
                } else if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                  if(g.gameType === 2) {
                    p.pontuacao = p.pontuacao + 2;
                  } else {
                    p.pontuacao = p.pontuacao + 1;
                  }  
                } else {
                  p.pontuacao = p.pontuacao + 0;
                }
              }  
              
            });
          });
      });

      
      data?.user?.forEach(u => {
        u.palpites.forEach(p => {
          data?.gamesDisponiveis?.forEach(g => {
            if(p.jogo === g._id) {
              g.palpite1 = p.palpite1;
              g.palpite2 = p.palpite2;
            }
          })
        })
      })          
      
      setUsuario(data?.user[0])
      setGames(data?.gamesDisponiveis)

    }
  }, [data])

  if(isFetching) {
    return <Spinner/>
  } 

  return (
    <>
      <Header />
      <section>
       <h1>Bem-vindo, {user && user.name}</h1>
        <br/>
        <h3>Voc?? pode palpitar at?? 15 minutos antes do in??cio do jogo!</h3>
        <h3 className='alerta'>INSTRU????ES:</h3>
        <h3 className='alerta'>- Caso a lista de jogos n??o esteja aparecendo, saia e fa??a seu login novamente, muito provavelmente h?? uma nova vers??o do site no ar!</h3>
        <h3 className='alerta'>- ?? necess??rio palpitar em um jogo por vez, um aviso em verde com a mensagem "Palpite Realizado" aparecer?? embaixo do bot??o de confirmar palpite e o palpite tamb??m aparecer?? na lateral!</h3>
        <h3 className='alerta'>- ?? poss??vel trocar seu palpite, ?? s?? enviar o palpite novamente, como se fosse a primeira vez, o seu palpite atualizado aparecer?? na lateral!</h3>
        <h3 className='alerta'>- Quando voc?? realizar um palpite os placares que voc?? enviou ficar??o salvos na caixinha mostrando o palpite que voc?? realizou, se a caixinha de enviar os palpites estiver vazia ?? porqu?? voc?? n??o fez um palpite ainda!</h3>
        <h2>Jogos</h2>
      </section>
      <div className='palpitesgrid'>
        <section className='contentpalpites'>
          <h2>Jogos dispon??veis para palpitar no momento!</h2>
          { 
            games?.length > 0 && 
            <div className='palpites'>
                { 
                  games?.map((jogo) => (
                    <PalpiteItem key={jogo._id} jogo={jogo} palpitou={setPalpitou}/>
                  ))
                }
            </div>
          }
          {
            games?.length === 0 && <h3>N??o h?? jogos cadastrados</h3>
          }     
        </section>
        <section className='contentpalpites'>
          <h2>Seus palpites</h2>
          {usuario?.palpites?.length > 0 && 
            <div className='palpite'>
              {usuario?.palpites?.sort(ordenarJogos).reverse().map((palpite) =>(
                <ListaPalpites key={palpite._id} palpite={palpite}/>
              ))}
            </div>
          }
          {
            usuario?.palpites?.length === 0 &&
            <h3>Voc?? ainda n??o fez palpites.</h3>
          }   
          
        </section>
      </div>          

    </>
  )
}

export default Dashboard