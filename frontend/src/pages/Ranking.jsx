import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner'
import useApi from '../hooks/useApi'
import { useState } from 'react'
import {ordenarRanking} from '../components/utils'
import Header from '../components/Header/Header'

function Ranking() {

  const {data, error, isFetching} = useApi("/api/ranking")

  const navigate = useNavigate()

  const [users, setUsers] = useState(null)

  const user = JSON.parse(localStorage.getItem('user'))
  
  useEffect(() => {
    if(!user) {
      navigate('/login')
    }

  }, [user, navigate])

  useEffect(() => {
    if(data) {
      data?.users?.forEach(u => {   
          u.pontuacao = 0;
          u.palpites.forEach(p => {
            data?.games?.forEach(g => {
              if(p.jogo === g._id) {
                if(p.palpite1 === g.placar1 && p.palpite2 === g.placar2){
                  if(g.gameType === 2) {
                    u.pontuacao = u.pontuacao + 10;
                  } else {
                    u.pontuacao = u.pontuacao + 5;
                  }
                } else if((p.palpite1 > p.palpite2 && g.placar1 > g.placar2) || (p.palpite1 < p.palpite2 && g.placar1 < g.placar2)) {  
                  if(g.gameType === 2) {
                    u.pontuacao = u.pontuacao + 6;
                  } else {
                    u.pontuacao = u.pontuacao + 3;
                  }
                  if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                    if(g.gameType === 2) {
                      u.pontuacao = u.pontuacao + 2;
                    } else {
                      u.pontuacao = u.pontuacao + 1;
                    }            
                  } 
                } else if(p.palpite1 === p.palpite2 && g.placar1 === g.placar2) {
                  if(g.gameType === 2) {
                    u.pontuacao = u.pontuacao + 6;
                  } else {
                    u.pontuacao = u.pontuacao + 3; 
                  } 
                } else if(p.palpite1 === g.placar1 || p.palpite2 === g.placar2) {
                  if(g.gameType === 2) {
                    u.pontuacao = u.pontuacao + 2;
                  } else {
                    u.pontuacao = u.pontuacao + 1;
                  }
                } else {
                  u.pontuacao = u.pontuacao + 0;
                }
              }
            });
          });
      });
      
    
      data?.users?.sort(ordenarRanking).reverse()
      setUsers(data.users)
    }
  
  }, [data])

  if(isFetching) {
    return <Spinner />
  } 

  return (
    <>
      <Header />
      <div className='ranking-top'>Ranking</div>
      <section className='ranking'>
        <div>
          <span>Posi????o</span>
          <span>Nome</span>
          <span>Pontua????o</span>
        </div>
        <p className='linha'></p>
        {
          users?.map((u, key) => {
            return (
              <div className='pos' key={key}>
                <div>{ key + 1 }</div>
                <div>{ u.name }</div>
                <div>{ u.pontuacao }</div>
              </div> 
            )
          })
        }
      </section>
      <p className='linha'></p>
      <h3 className='regras'>O ranking sempre ser?? atualizado alguns minutos ap??s o ??ltimo jogo do dia!</h3>
      <h2 className='regras'>Regras de Pontua????o - Mata-mata</h2>
      <h2 className='regras'>S?? vale os 90 (+30 de prorroga????o) minutos do jogo, p??naltis n??o contam pro resultado.</h2>
      <p className='texto'>Acertar o placar em cheio: <b>10 pontos</b></p>
      <p className='texto'>Acertar que foi empate/o vencedor do jogo: <b>6 pontos</b></p>
      <p className='texto'>Errar o placar mas acertar o n??mero de gols de um dos times: <b>2 pontos</b></p>
      <p className='texto'>Errar completamente o placar: <b>0 pontos</b></p>
    </>
  )
}

export default Ranking