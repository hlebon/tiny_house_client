import { server } from "../../lib";
import { ListingData } from "./types";

const LISTINGS = `
    query Listings {
        listings{
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBaths
            rating
        }
    }
`;

interface ListingsProps {
  title: string;
}

export function Listings({ title }: ListingsProps) {
  const fetchListings = async () => {
    const { data } = await server.fetch<ListingData>({ query: LISTINGS });
    console.log({ data });
  };
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={fetchListings}>Query Listing</button>
    </div>
  );
}
