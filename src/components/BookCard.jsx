import React,{useState} from 'react';
export default function BookCard({book,onOpen}){const [hover,setHover]=useState(false);return <article className="book-item" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
 <button className="spine-button" onClick={()=>onOpen(book)} aria-label={`Open ${book.title}`}>
  <div className="book-spine" style={{backgroundImage:`linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.1)),url(${book.cover})`}}><span>{book.title}</span><i>{book.author}</i></div>
  {hover&&<span className="cover-hint">Open cover</span>}
 </button>
 <div className="book-meta"><strong>{book.title}</strong><span>{book.author}</span></div>
 </article>}
