import Form from './form';
import withAuth from './withAuth';


const page = () => {
  return (
   
      <Form />
 
  );
};

export default withAuth(page);