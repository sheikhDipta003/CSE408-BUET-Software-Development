import { useParams } from 'react-router-dom';

const ProductListing = () => {
    const { category, subcategory } = useParams();

    return (
        <main className='ProductListing'>
            <h2 style={{color:"black"}}>List of {subcategory} in {category} category</h2>
            <p style={{ color:"black", marginTop: "1rem" }}>This is the page where all the products related to {subcategory} will be displayed.</p>
        </main>
    )
}

export default ProductListing
