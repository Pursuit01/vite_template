import { defineStore } from "pinia";

const userStoreId = "user";
interface UserInfoImpl {
  firstName: string;
  lasrName: string;
  age: number;
}
export const useUserStore = defineStore(userStoreId, {
  state: () => ({
    userInfo: {
      firstName: "bob",
      lastName: "alice",
      age: 18,
    },
  }),
  getters: {
    fullName: ({ userInfo }) => {
      return userInfo.firstName + userInfo.lastName;
    },
  },
  actions: {
    setAge(age: number) {
      this.userInfo.age = age;
    },
  },
});
