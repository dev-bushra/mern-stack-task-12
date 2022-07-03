import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home({ products }) {
  return (
    <div className={styles.container}>
      
      <h1>MERN Stack Task</h1>
      
      {
        products.nodes.map(product => {
          return(
            <ul key={product.slug}>
              <li>
                <Link href={`/product/${product.id}`}>{product.name}</Link>
              </li>
            </ul>
          )
        })
      }

    </div>
  )
}

export async function getStaticProps() {

  const res = await fetch('http://wp.local/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          query: `
          query HomePageQuery {
            products {
              nodes {
                slug
                name
                price
                image
                description
              }
            }
          }
          `,
      })
  })

  const json = await res.json()

  return {
    props: {
      products: json.data.products,
    },
  }

}
