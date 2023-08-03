import { loremIpsum } from "react-lorem-ipsum";

export default {
  count: 14,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      title: "Strategy 1",
      slug: "strategy-1",
      description: loremIpsum() + "1",
      creator: "Andrea Delgadillo Tomasevich",
      created: "2023-07-24",
    },
    {
      id: 2,
      title: "Strategy 2",
      slug: "strategy-2",
      description: loremIpsum() + "2",
      creator: "Dmitry Chalganov",
      created: "2023-07-25",
    },
    {
      id: 3,
      title: "Strategy 3",
      slug: "strategy-3",
      description: loremIpsum() + "3",
      creator: "John Yin",
      created: "2023-07-26",
    },
    {
      id: 4,
      title: "Strategy 4",
      slug: "strategy-4",
      description: loremIpsum() + "4",
      creator: "Julian Ritchey",
      created: "2023-07-27",
    },
    {
      id: 5,
      title: "Strategy 5",
      slug: "strategy-5",
      description: loremIpsum() + "5",
      creator: "Wanlin Li",
      created: "2023-07-28",
    },
  ],
};
