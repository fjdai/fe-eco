import { callGetProductBySlug } from "../services/apiProducts/apiProducts";

export async function productDetailLoader({ params }: any) {
  const slug = params.slug;
  const response = await callGetProductBySlug(slug);
  if (!response || (response as any).statusCode !== 200) {
    throw new Response('Không tìm thấy sản phẩm', { status: 404 });
  }
  return response.data;
}
