// slug

export default function Product( data ){

    const product = data.product;

    return (
        <div>
            <h1>{product.name}</h1>
            <Image src={product.image.node.sourceUrl} />
            <article dangerouslySetInnerHTML={{__html: product.description}}></article>
        </div>
    )

}

export async function getStaticProps(context) {

    const res = await fetch('http://wp.local/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query SingleProduct($id: ID!, $idType: ProductIdType!) {
                    product(id: $id, idType: $idType) {
                        slug
                        name
                        description
                        image {
                            node {
                                sourceUrl
                            }
                        }
                    }
                }
            `,
            variables: {
                id: context.params.slug,
                idType: 'SLUG'
            }
        })
    })

    const json = await res.json()

    return {
        props: {
            product: json.data.product,
        },
    }

}

export async function getStaticPaths() {

    const res = await fetch('http://wp.local/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
            query AllProductQuery {
                product {
                    nodes {
                        slug
                        name
                        description
                        image {
                            node {
                                sourceUrl
                            }
                        }
                    }
                }
            }
        `})
    })

    const json = await res.json()
    const products = json.data.products.nodes;

    const paths = products.map((product) => ({
        params: { slug: product.slug },
    }))

    return { paths, fallback: false }

}