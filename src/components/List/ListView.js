import React , { useState , useEffect , useRef , useCallback } from 'react';
import styles from '../../style/List.module.css';
import GetStarsReposInlast30Days from './ListLogic'

export default function ListView() {
  //the search state 
  const [searchKeyword , setSearchKeyword] = useState("")  
  //the page number state 
  const [pageNumber , setPageNumber] = useState(1)

  //call back the custum hook for fetching all stars repos in last 30 days
  const {loading , repos , hasMore} = GetStarsReposInlast30Days(pageNumber)

  //initial useRef
  const observer = useRef()

  //create a const for the last repo rendred 
  const lastRepoRef = useCallback( node =>{

    if (loading) return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver( entries =>{
        if(entries[0].isIntersecting && hasMore){
          setPageNumber(previousPageNumber => previousPageNumber + 1)
        }
    })
    if(node) observer.current.observe(node)
  }, [loading, hasMore])


  useEffect(() => {
   setPageNumber(1)
  }, [])
  return (
    <>
        <div className={styles.searchBarContainer}>
            <div className={styles.inputContainer}>
               <i className="fa fa-search" id={styles.searchIcon}></i>
               <input 
                  className={styles.inputField} 
                  type="text" 
                  placeholder="Recherche par nom de repository"
                  onChange={ event => setSearchKeyword(event.target.value)}
                />
            </div>
        </div>
        <div className={styles.blankSpace}></div>

        {repos.filter(val =>{
            if(searchKeyword === ""){
                return val
            }else if(val.name.toLowerCase().includes(searchKeyword.toLowerCase())){
                return val
            }
        }).map((repo , index ) => {
            if(repos.length === index + 1) {
              return (
                    <div ref={lastRepoRef} className={styles.itemContainer} key={index}>
                        <div className={styles.itemImageContainer}>
                            <div className={styles.imageTicket}>Lorem ipsum</div>
                            <img src={`https://source.unsplash.com/random/300x200?sig=${Math.random()}`} alt="" />
                        </div>
                        <div className={styles.itemDetailsContainer}>
                        <h3>{repo.name}</h3>
                        <p>{repo.description}</p>
                        <br/> <br/>
                            <span>
                            <i className="fa fa-window-minimize" id={styles.lineIcon}></i>  lire plus
                            </span>
                        </div>
                    </div>
                )

            }else{

              return (
                <div className={styles.itemContainer} key={index}>
                    <div className={styles.itemImageContainer}>
                       <div className={styles.imageTicket}>Lorem ipsum</div>
                       <img src={`https://source.unsplash.com/random/300x200?sig=${Math.random()}`} alt="" />
                    </div>
                    <div className={styles.itemDetailsContainer}>
                    <h3>{repo.name}</h3>
                    <p>{repo.description}</p>
                    <br/> <br/>
                        <span>
                        <i className="fa fa-window-minimize" id={styles.lineIcon}></i>  lire plus
                        </span>
                    </div>
                </div>
              )
            }
        })}

        <div className={styles.loading}>{loading && <img src="loading.gif"  alt="" />}</div>
    </>
  );
}
