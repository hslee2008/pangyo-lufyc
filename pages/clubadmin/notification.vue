<template>
  <div class="mx-4" style="width: 100%">
    <br />

    <div class="pa-4 rounded-lg d-flex justify-center">
      <img
        :src="
          clubInfo.image ??
          'https://firebasestorage.googleapis.com/v0/b/thinkforall-linkall.appspot.com/o/school%2FPGHS.png?alt=media&token=1a077cc3-d8f0-4994-8d62-09d68ef49739'
        "
        draggable="false"
        class="rounded-lg"
        style="width: 300px"
      />
    </div>

    <div />

    <h1 class="text-center">{{ clubName }}</h1>
    <h3 class="text-center">
      {{ clubInfo.leader }} /
      {{ clubInfo.coleader }}
    </h3>

    <br />

    <v-list lines="two">
      <v-list-item v-for="item in notifications" :key="item.message">
        <v-list-item-title>{{ item.date }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.message }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
    
    <br />

    <div>
      <v-text-field v-model="today" variant="outlined"></v-text-field>
      <v-textarea
        v-model="newNotification"
        placeholder="공지사항 등록하기 ex) 동아리 첫 모임은 3월 25일입니다. 필기구 준비해 주세요. "
        variant="outlined"
        width=""
        append-inner-icon="mdi-send"
        @click:appendInner="send"
      ></v-textarea>
    </div>
  </div>
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";

const clubInfo = ref({
  leader: "",
  coleader: "",
  description: "",
  image: "",
  major: "",
  memberNumber: 20,
  how: "면접",
  start: "2024-05-01",
  end: "2024-05-16",
  getWhyJoined: false,
});
const account = ref({});

const notifications = ref([]);
const newNotification = ref("");
const today = ref("");

const { $auth, $db } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const clubName = route.query.clubname;

onMounted(async () => {
  const clubRef = dbRef($db, `clubs/${clubName}`);
  await onValue(clubRef, (snapshot) => (clubInfo.value = snapshot.val()));

  onAuthStateChanged($auth, (user) => {
    account.value = user;
  });

  const notificationRef = dbRef($db, `clubs/${clubName}/notification`);
  onValue(
    notificationRef,
    (snapshot) => (notifications.value = snapshot.val())
  );

  const date = new Date();
  today.value = date.getMonth() + "월 " + date.getDate() + "일";
});

function send() {
  const notificationRef = dbRef($db, `clubs/${clubName}/notification`);
  push(notificationRef, { message: newNotification.value, date: today.value });
  newNotification.value = "";
}
</script>
