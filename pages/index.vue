<template>
  <div>
    <br /><br />

    <div class="text-center">
      <p color="text-gray">
        <img
          src="https://pangyo-h.goesn.kr/upload/pangyo-h/logo/img_9e63452b-11df-4ae5-aba6-8cb5def1c5bc1637653713039.png"
          draggable="false"
        />
      </p>
      <h1>찾아줄게, 너의 동아리</h1>

      <br />

      <v-alert class="mx-4 text-justify">
        찾아줄게, 너의 동아리 어플은 판교고등학교 학생들이 보다 쉽게 자신이
        원하는 동아리를 찾게 도와줍니다. 실시간으로 다양한 정보를 제공하고 어플
        내에서 동아리원과 부장의 소통이 가능합니다.
      </v-alert>

      <br />
      <br />
      <br />

      <v-alert v-if="!account" class="mx-4">
        <p class="text-justify">
          서비스 활용을 위해 판교고등학교 구글계정 (pangyo.hs.kr)으로 로그인해
          주세요.
        </p>

        <br />

        <div class="d-flex justify-center ga-4">
          <v-btn color="blue" variant="outlined" @click="asmember">
            <b>동아리원</b>
          </v-btn>
          <v-btn color="purple" variant="outlined" to="/login/asleader">
            <b>부장 · 차장</b>
          </v-btn>
          <v-btn color="teal" variant="outlined" @click="asteacher">
            <b>선생님</b>
          </v-btn>
        </div>
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
        <b>{{ account.displayName }}</b>
        님

        <br />

        동아리원으로 접수가 되었습니다.

        <br /><br />

        <ul>
          <li>1. 하단의 <동아리>에서 동아리 명단을 확인하세요.</li>
          <li>2. 하단의 <계정>에서 친구들이 볼 계정 정보를 편집하세요.</li>
        </ul>
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

const { $auth, $db } = useNuxtApp();

const router = useRouter();

const account = ref({});

const logout = () => {
  $auth.signOut();
  account.value = null;
};

const asmember = async () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup($auth, provider).then(() =>
    onAuthStateChanged($auth, async (user) => {
      account.value = user;

      if (user?.email?.includes("pangyo.hs.kr")) {
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
      }
    })
  );
};

const asteacher = async () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup($auth, provider).then(() =>
    onAuthStateChanged($auth, async (user) => {
      account.value = user;

      if (user?.email?.includes("pangyo.hs.kr") || true) {
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
