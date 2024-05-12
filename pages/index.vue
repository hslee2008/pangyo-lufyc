<template>
  <div>
    <div class="text-center">
      <v-parallax src="/pangyo.png">
        <div
          color="text-gray"
          class="mt-7 pt-2 mb-3"
          style="background-color: white"
        >
          <img
            src="https://pangyo-h.goesn.kr/upload/pangyo-h/logo/img_9e63452b-11df-4ae5-aba6-8cb5def1c5bc1637653713039.png"
            draggable="false"
          />
        </div>
        <h1 class="text-white mt-2 mb-3" style="font-size: 35px">
          찾아줄게! 너의 동아리
        </h1>
        <v-alert class="mx-4 text-justify" elevation="24">
          찾아줄게! 너의 동아리 어플은 판교고등학교 학생들이 보다 쉽게 자신이
          원하는 동아리를 찾게 도와줍니다. 실시간으로 다양한 정보를 제공하고
          어플 내에서 동아리원과 부장의 소통이 가능합니다.
        </v-alert>

        <br />
        <br />

        <v-btn
          variant="tonal"
          class="rounded-circle"
          size="x-large"
          style="background-color: white"
          icon="mdi-arrow-down"
          @click="() => (y += 5000)"
        ></v-btn>

        <div
          style="
            position: absolute;
            bottom: 0;
            width: 100%;
            background-color: white;
            opacity: 0.6;
          "
        >
          <p>Copyright © LUFYC 2024 — All rights reserved</p>
          <p>버전 v0.0.11</p>
        </div>
      </v-parallax>

      <br />
      <br />
      <br />

      <v-alert v-if="!account" class="mx-4">
        <p class="text-justify">
          서비스 활용을 위해 판교고등학교 구글계정 (pangyo.hs.kr)으로 로그인해
          주세요.
        </p>

        <br />

        <v-btn color="blue" variant="tonal" @click="login" block>
          <b>로그인하기</b>
        </v-btn>
      </v-alert>

      <v-alert
        v-if="account && !account?.email?.includes('pangyo.hs.kr')"
        class="text-justify mx-4 mt-2"
      >
        {{ account.email }}
        <span class="text-red text-decoration-underline">
          판교고 계정이 아닌 구글 계정
        </span>
        으로 로그인했습니다. pangyo.hs.kr로 끝나는 계정으로 로그인하세요.

        <br />
        <br />

        <v-btn color="red" block @click="logout">로그아웃</v-btn>
      </v-alert>
      <v-alert
        v-if="account && account?.email?.includes('pangyo.hs.kr')"
        class="text-justify mx-4 mt-2"
      >
        <div class="d-flex">
          <v-img
            :src="account.photoURL"
            class="rounded-circle mr-5"
            max-width="50"
          ></v-img>

          <div>
            <b>{{ account.displayName }}</b
            >님

            <br />

            동아리원으로 접수가 되었습니다.
          </div>
        </div>
      </v-alert>
    </div>
  </div>
</template>

<script setup>
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { useWindowScroll } from "@vueuse/core";

const { x, y } = useWindowScroll({ behavior: "smooth" });

const { $auth, $db } = useNuxtApp();

const account = ref({});

const logout = () => {
  $auth.signOut();
  account.value = null;
};

const login = async () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup($auth, provider).then(() =>
    onAuthStateChanged($auth, async (user) => {
      account.value = user;

      //if (!user?.email?.includes("pangyo.hs.kr")) return;

      if (/^\d+$/.test(user?.email?.slice(0, user?.email?.indexOf("@")))) {
        const everyone = dbRef($db, `everyone/${user.displayName}`);
        set(everyone, {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          type: "member",
        });

        const memberRef = dbRef($db, `/member/${user.displayName}`);
        set(memberRef, {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
        });
      } else {
        const everyone = dbRef($db, `everyone/${user.displayName}`);
        set(everyone, {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          type: "teacher",
        });

        const memberRef = dbRef($db, `/teacher/${user.displayName}`);
        set(memberRef, {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
        });
      }
    })
  );
};

onMounted(() => {
  onAuthStateChanged($auth, (user) => (account.value = user));
});
</script>
