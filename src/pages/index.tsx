import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IProduct {
  id: string;
  title: string;
  image: string;
  price: string;
}

export default function Home() {
  const [showToast, setShowToast] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [showProduct, setShowProduct] = useState<string | null>(null);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("https://fakestoreapi.com/products");
      return res.json();
    },
    enabled: fetchData,
  });

  const {
    data: detailProduct,
    isLoading: isLoadingDetailProduct,
    isError: isErrorDetailProduct,
    isSuccess: isSuccessDetailProduct,
  } = useQuery({
    queryKey: ["product", showProduct],
    queryFn: async () => {
      const res = await fetch(
        `https://fakestoreapi.com/products/${showProduct}`
      );
      return res.json();
    },
    enabled: showProduct !== null,
  });

  console.log(detailProduct);

  useEffect(() => {
    if (isSuccess) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  });

  console.log(isError);
  return (
    <div className='container mx-auto p-8'>
      {!fetchData && (
        <button
          onClick={() => setFetchData(true)}
          className='p-4 shadow-sm font-bold m-2 rounded-md'
        >
          Get Product
        </button>
      )}
      {showToast && (
        <div className='fixed top-4 right-4 z-50 shadow-sm p-4 bg-green-500 font-bold rounded-md text-white'>
          Success Get Product Data
        </div>
      )}
      {isLoading ? (
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-5'>
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              className='shadow p-4 flex bg-slate-600 flex-col items-center animate-pulse aspect-square'
              key={`loading-${index}`}
            />
          ))}
        </div>
      ) : (
        <div>
          {isError ? (
            <div className='text-red-500 text-4xl font-bold'>
              Data Not Found
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-5'>
              {data?.map((product: IProduct) => (
                <div
                  key={`product-${product.id}`}
                  className='shadow p-4 flex flex-col items-center'
                  onClick={() => setShowProduct(product.id)}
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
          )}
        </div>
      )}
      <div
        className={`fixed h-screen w-screen top-0 left-0 bg-black/50 ${
          showProduct ? "flex justify-center items-center" : "hidden"
        }`}
      >
        <div className='relative w-1/2 h-1/2 bg-white flex items-center gap-8 p-8'>
          <button
            className='absolute top-5 right-5'
            onClick={() => setShowProduct(null)}
          >
            X
          </button>
          <img
            src={detailProduct?.image}
            alt={detailProduct?.title}
            className='w-1/4'
          />
          <div className='w-3/4 space-y-4 h-3/4  overflow-auto'>
            <h1 className='font-bold text-2xl'>{detailProduct?.title}</h1>
            <p className='text-md '>{detailProduct?.description}</p>
            <p className='text-2xl font-bold'>{detailProduct?.price}$</p>
          </div>
        </div>
      </div>
    </div>
  );
}
