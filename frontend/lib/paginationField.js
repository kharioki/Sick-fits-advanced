import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // this tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      console.log({ existing, args, cache });
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If
      // there are items,
      // AND there aren't enough to satisfy how many are requested,
      // AND we are on the last page
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // we dont have any items, we go to network to fetch them
        return false;
      }
      // if there are items, return them from cache
      if (items.length) {
        console.log(`There are ${items.length} items in the cache!`);
        return items;
      }

      return false; // fallback to network
      // asks the read function for those items
      // then
      // first we can return items because they are already in cache
      // we could also return false from here, (network request)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when the Apollo Client comes back from the network with our products
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log({ merged });

      // finally return merged items from cache
      return merged;
    },
  };
}
