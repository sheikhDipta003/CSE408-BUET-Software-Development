import React, { useState } from 'react';
import { Table, Form, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductComparisonPage = () => {
  const [product1, setProduct1] = useState('');
  const [product2, setProduct2] = useState('');

  const handleProduct1Change = (e) => {
    setProduct1(e.target.value);
  };

  const handleProduct2Change = (e) => {
    setProduct2(e.target.value);
  };

  const criteriaData = [
    { criteria: 'Price', feature1: 'Price1', feature2: 'Price2' },
    { criteria: 'Quality', feature1: 'Quality1', feature2: 'Quality2' },
    { criteria: 'Durability', feature1: 'Durability1', feature2: 'Durability2' },
    // Add more criteria as needed
  ];

  return (
    <div>
      <h1>Product Comparison</h1>
      
      {/* <Form>
        <Form.Row className="mb-3">
          <Col>
            <Form.Control placeholder="Product 1" value="abc" onChange={handleProduct1Change} />
          </Col>
          <Col>
            <Form.Control placeholder="Product 2" value="xyz" onChange={handleProduct2Change} />
          </Col>
        </Form.Row>
      </Form> */}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Criteria</th>
            <th>'Product 1'<br></br>
            <input
            type="text"
            value="abc"
            onChange={(e) => setProduct1(e.target.value)}
            placeholder="Search for product, categories, subcategories..."
            />
            </th>
            <th>'Product 2'<br></br>
            <input
            type="text"
            value="abc"
            onChange={(e) => setProduct1(e.target.value)}
            placeholder="Search for product, categories, subcategories..."
            />
            </th>
          </tr>
        </thead>
        <tbody>
          {criteriaData.map((item, index) => (
            <tr key={index}>
              <td>{item.criteria}</td>
              <td>{item.feature1}</td>
              <td>{item.feature2}</td>
            </tr>
          ))}
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ProductComparisonPage;
