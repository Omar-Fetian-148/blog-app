import mongoose from "mongoose";
import { cacheClient, publisher, subscriber } from '../../config/redis.js';
import postResolvers from "../../schema/resolvers/postResolvers.js";
import userResolvers from "../../schema/resolvers/userResolvers.js";

beforeAll(async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.DB_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
  publisher.disconnect();
  subscriber.disconnect();
  cacheClient.disconnect();
});

let post;
let token;

describe("Registration Process", () => {

  it('should create a user', async () => {
    const register = await userResolvers.Mutation.registerUser(
      {},
      {
        username: 'testing',
        role: 'ADMIN',
        gender: 'MALE',
        password: 'Aa12345678',
        confirmPassword: 'Aa12345678',
        email: 'testing@testing.com'
      },
      { headers: { language: "en" } }
    );
    console.log('register: ', register)

  })

  it('should verify he email', async () => {
    const checkOTP = await userResolvers.Mutation.checkOTP(
      {},
      {
        OTP: '123456',
        email: 'testing@testin.com'
      },
      { headers: { language: "en" } }
    )
    console.log('checkOTP: ', checkOTP)

  })

  it('should login the user', async () => {
    const login = await userResolvers.Mutation.loginUser(
      {},
      {
        password: 'Aa12345678',
        email: 'testing@testin.com'
      },
      { headers: { language: "en" } }
    )
    console.log('login: ', login)
  })
});
