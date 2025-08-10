import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface IProduct {
  id: string;
  title: string;
  image: string;
  price: string;
}

export default function Home() {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("https://fakestoreapi.com/products");
      return res.json();
    },
  });
  console.log(query);
  return (
    <div className='container mx-auto grid grid-cols-1 gap-4 lg:grid-cols-5'>
      {query.data?.map((product: IProduct) => (
        <div
          key={`product-${product.id}`}
          className='shadow p-4 flex flex-col items-center'
        >
          <Image
            width={100}
            height={100}
            src={product.image}
            alt={product.title}
            className='scale-50 h-40 w-fit'
          />
          <h4 className='font-bold text-center text-lg line-clamp-1'>
            {product.title}
          </h4>
          <p>{product.price}$</p>
        </div>
      ))}
    </div>
  );
}
