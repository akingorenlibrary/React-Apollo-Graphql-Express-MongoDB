const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config(); // .env dosyasını yükle

// MongoDB bağlantısı ve Post modeli
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch(err => console.log('MongoDB bağlantı hatası:', err));

const Post = mongoose.model('post', new mongoose.Schema({
  title: String,
  content: String,
}), 'post');

// GraphQL Şeması (Schema)
const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  type Query {
    posts: [Post]
  }

  type Mutation {
    addPost(title: String!, content: String!): Post
  }
`;

// Resolver: MongoDB ile Veri Çekme ve Veri Ekleme
const resolvers = {
  Query: {
    posts: async () => {
      // Veritabanından blog yazılarını çekiyoruz
      return await Post.find();
    },
  },
  Mutation: {
    addPost: async (_, { title, content }) => {
      // Yeni bir post ekliyoruz
      const newPost = await new Post({ title, content });
      console.log("newPost: ", newPost);
      await newPost.save(); // Veritabanına kaydediyoruz
      return newPost;
    },
  },
};

// Apollo Server Başlatma
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server is running at ${url}`);
});
