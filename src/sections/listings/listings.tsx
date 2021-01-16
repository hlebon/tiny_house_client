import { server } from "../../lib";
import {
  ListingData,
  DeleteListingData,
  DeleteListingVariables,
} from "./types";

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

const DELETE_LISTING = `
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
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

  const deleteListing = async () => {
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: {
        id: "5fff1e6c1502973e00c18b61",
      },
    });
    console.log({ data });
  };

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={fetchListings}>Query Listing</button>
      <button onClick={deleteListing}>Delete Listing</button>
    </div>
  );
}
