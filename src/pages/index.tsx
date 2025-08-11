import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { title } from "process";
import { FormEvent, useEffect, useState } from "react";

interface IProduct {
  id: string | number;
  title: string;
  image: string;
  price: string | number;
  description?: string;
  category?: string;
}

export default function Home() {
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [showProduct, setShowProduct] = useState<string | number | null>(null);
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

  useEffect(() => {
    if (isSuccess) {
      setShowToast("Success get data");
      setTimeout(() => {
        setShowToast(null);
      }, 3000);
    }
  }, [isSuccess]);

  // post JSON
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: IProduct) => {
      return await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setShowAddProduct(false);
      setShowToast("Success add product");
      setTimeout(() => {
        setShowToast(null);
      }, 3000);
    },
  });

  //post JSON
  const onSubmitProduct = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const payload = {
      id: parseInt(form.id.value),
      title: form.title.value,
      price: parseInt(form.price.value),
      description: form.description.value,
      category: form.category.value,
      image: form.image.value,
    };
    mutate(payload);
  };

  // post formData
  // const mutationAddProduct = useMutation({
  //   mutationFn: async (formData: FormData) => {
  //     return await fetch("https://fakestoreapi.com/products", {
  //       method: "POST",
  //       body: formData,
  //     });
  //   },
  // });

  // post formData
  // const onSubmitProduct = (e: FormEvent) => {
  //   e.preventDefault();
  //   mutationAddProduct.mutate(new FormData(e.target as HTMLFormElement));
  // };

  console.log(isError);
  return (
    <div className='container mx-auto p-8'>
      {!fetchData && (
        <button
          onClick={() => setFetchData(true)}
          className='px-4 py-2 shadow-sm font-bold mb-2 rounded-md'
        >
          Get Product
        </button>
      )}
      {showToast !== null && (
        <div className='fixed top-4 right-4 z-50 shadow-sm p-4 bg-green-400 font-bold rounded-md text-white'>
          {showToast}
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
            <div>
              <div className='mb-4'>
                <button
                  className='bg-blue-500 text-white px-4 py-2 rounded-md'
                  onClick={() => setShowAddProduct(true)}
                >
                  Add Product
                </button>
                <div
                  className={`fixed h-screen w-screen top-0 left-0 bg-black/50 ${
                    showAddProduct
                      ? "flex justify-center items-center z-50"
                      : "hidden"
                  }`}
                >
                  <div className='relative lg:w-1/4 w-1/3 bg-white flex items-center gap-8 p-8'>
                    <button
                      className='absolute top-5 right-5'
                      onClick={() => setShowAddProduct(false)}
                    >
                      X
                    </button>
                    <form
                      className='w-full space-y-4'
                      onSubmit={onSubmitProduct}
                    >
                      <label htmlFor='id' className='flex flex-col'>
                        ID:
                        <input
                          type='number'
                          id='id'
                          name='id'
                          className='border-2 w-full p-2 rounded-md'
                        />
                      </label>
                      <label htmlFor='title' className='flex flex-col'>
                        Title:
                        <input
                          type='text'
                          id='title'
                          name='title'
                          className='border-2 w-full p-2 rounded-md'
                        />
                      </label>
                      <label htmlFor='price' className='flex flex-col'>
                        Price:
                        <input
                          type='number'
                          id='price'
                          name='price'
                          className='border-2 w-full p-2 rounded-md'
                        />
                      </label>
                      <label htmlFor='description' className='flex flex-col'>
                        Description:
                        <input
                          type='text'
                          id='description'
                          name='description'
                          className='border-2 w-full p-2 rounded-md'
                        />
                      </label>
                      <label htmlFor='category' className='flex flex-col'>
                        Category:
                        <input
                          type='text'
                          id='category'
                          name='category'
                          className='border-2 w-full p-2 rounded-md'
                        />
                      </label>
                      <label htmlFor='image' className='flex flex-col'>
                        Image:
                        <input
                          type='text'
                          id='image'
                          name='image'
                          className='border-2 w-full p-2 rounded-md'
                        />
                      </label>
                      <button className='w-full bg-black text-white px-4 py-2 rounded-md font-bold'>
                        {isPending ? "Loading..." : "Submit"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
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
