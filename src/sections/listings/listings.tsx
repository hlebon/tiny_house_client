import { server } from "../../lib";

const LISTINGS = `
    query Listings {
        listings{
            id
            title
            image
            address
            price
        }
    }
`;

interface ListingsProps {
  title: string;
}

export function Listings({ title }: ListingsProps) {
  const fetchListings = async () => {
    const listings = await server.fetch({ query: LISTINGS });
    console.log({ listings });
  };
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={fetchListings}>Query Listing</button>
    </div>
  );
}
