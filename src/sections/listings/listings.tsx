import { useCallback, useEffect, useState } from "react";
import { server } from "../../lib";
import { Listing } from "./types";
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
  const [listings, setListings] = useState<Listing[]>([]);

  const fetchListings = useCallback(() => {
    const getListings = async () => {
      const { data } = await server.fetch<ListingData>({ query: LISTINGS });
      setListings(data.listings);
    };
    getListings();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id,
      },
    });
    removeFromListing(id);
  };

  const removeFromListing = (id: string) => {
    setListings((currentListings) =>
      currentListings.filter((listing) => listing.id !== id)
    );
  };

  const listingsList = (
    <ul>
      {listings.map(({ id, title }) => {
        return (
          <li key={id}>
            {title}
            <button type="button" onClick={() => deleteListing(id)}>
              delete
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      <h1>{title}</h1>
      <ul>{listingsList}</ul>
      <button onClick={fetchListings}>Query Listing</button>
    </div>
  );
}
