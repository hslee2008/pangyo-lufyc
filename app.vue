<template>
  <v-app>
    <NuxtLayout>
      <v-main>
        <div class="d-flex justify-center">
          <NuxtPage />
        </div>

        <br /><br /><br />
      </v-main>
    </NuxtLayout>

    <v-bottom-navigation
      v-if="account"
      color="skyblue"
      height="50"
      elevation="10"
      grow
      selected-class="text-blue"
    >
      <v-btn to="/">
        <v-icon>mdi-home</v-icon>

        <span>홈</span>
      </v-btn>

      <v-btn to="/club">
        <v-icon>mdi-town-hall</v-icon>

        <span>동아리</span>
      </v-btn>

      <v-btn to="/account">
        <v-icon>mdi-account</v-icon>

        <span>계정</span>
      </v-btn>

      <v-btn v-if="typeofAccount === 'teacher'" to="/admin">
        <v-icon>mdi-security</v-icon>

        <span>Admin</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";

const { $auth, $db } = useNuxtApp();

const router = useRouter();

const account = ref({});
const typeofAccount = ref("member");

onMounted(() => {
  onAuthStateChanged($auth, (user) => {
    account.value = user;

    const type = dbRef($db, `/everyone/${user.displayName}/type`);
    onValue(type, (snapshot) => (typeofAccount.value = snapshot.val()));
  });
});

useHead({
  title: "찾아줄게! 너의 동아리",
});
</script>
