import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { IProduct } from "../interfaces/IProduct";
import { getProducts } from "../services/products-service";
import { useQuery } from "react-query";

const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const {} = useQuery({
    queryKey: ''
  })

  const fetchProducts = useCallback(
    debounce(async (pageNumber: number, elementsPerPage: number) => {
      const productsData = await getProducts({
        page: pageNumber,
        limit: elementsPerPage,
      });
      setProducts(productsData);
    }, 500),
    [debounce],
  );

  return fetchProducts;
};

export default useProducts;
