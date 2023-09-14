import { Link } from "react-router-dom";

const OrderItemCard = ({
  id,
  productName,
  thumbnail,
  subcategory,
  category,
}: any) => {
  return (
    <Link to={`/${category}/${subcategory}/${id}`} key={id}>
      <p>{productName}</p>
      <img src={thumbnail} alt={`image for ${productName}`} />
    </Link>
  );
};

export default OrderItemCard;