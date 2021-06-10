import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      price
      description
      status
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

export default function UpdateProduct({ id }) {
  // get the existing product
  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  // mutation to update product
  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  // create some state for the form inputs:
  const { inputs, handleChange, clearForm, resetForm } = useForm(data?.Product);
  console.log({ inputs });

  if (loading) return <p>Loading...</p>;

  // form to handle updates
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        // submit the input fields to the backend:
        // TODO: handle submit
        const res = await updateProduct({
          variables: {
            id,
            name: inputs.name,
            price: inputs.price,
            description: inputs.description,
          },
        }).catch(console.error);
        console.log(res);
        // clear form
        // clearForm();
        // go to products page
        // Router.push({
        //   pathname: `/product/${res.data.createProduct.id}`,
        // });
      }}
    >
      <DisplayError error={error || updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Product name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Product price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Product description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  );
}
