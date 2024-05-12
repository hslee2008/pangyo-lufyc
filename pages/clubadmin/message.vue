<template>
  <div class="mx-4">
    <br />

    <h1 class="text-center">{{ clubName }}</h1>
    <h3 class="text-center">
      {{ clubInfo.leader }} ·
      {{ clubInfo.coleader }}
    </h3>

    <br />

    <div v-if="clubInfo.message">
      <v-card v-for="(item, i) in clubInfo.message" :key="i">
        <v-card-title>{{ i }}</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="message in item" :key="message">
              <v-list-item-title>{{ message }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-text-field
            v-model="answer"
            variant="outlined"
            placeholder="답하기"
            append-inner-icon="mdi-send"
            @click:appendInner="() => send(item, i)"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </div>
    <div v-else>
      <v-card elevation="0">
        <v-card-title class="text-center">문의사항이 없습니다</v-card-title>
      </v-card>
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

const answer = ref("");

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
});

const notJoining = (info, isActive) => {
  if (confirm(`진짜로 ${info.name}을 삭제할 것인가요?`)) {
    // remove from joining database
    const clubRef = dbRef($db, `clubs/${clubName}/joining/${info.name}`);
    set(clubRef, null);

    // remove the joined true value
    const memberRef = dbRef($db, `member/${info.name}/joined`);
    set(memberRef, null);

    // notify of the removal
    const memberNotifRef = dbRef($db, `member/${info.name}/notification/`);
    push(memberNotifRef, {
      message: `죄송합니다. ${clubName} 동아리에서 탈락했습니다. 다른 동아리에 지원 부탁드립니다.`,
    });
  }

  isActive.value = false;
};

const joining = async (info, isActive) => {
  if (confirm(`진짜로 ${info.name}을 합격시킬 것인가요?`)) {
    let data = {};
    const clubRef = dbRef($db, `clubs/${clubName}/joining/${info.name}`);

    await onValue(clubRef, async (snapshot) => {
      data = await snapshot.val();
    });

    // notify of the removal
    const memberNotifRef = dbRef($db, `member/${info.name}/notification/`);
    push(memberNotifRef, {
      message: `축하합니다. ${clubName} 동아리에 들어가게 되었습니다. 공지사항은 이 앱을 통해 부장으로부터 받을 수 있습니다..`,
    });

    console.log(data);
    const acceptedRef = dbRef($db, `clubs/${clubName}/accepted/${info.name}`);
    await set(acceptedRef, data);

    // Remove from joining database after data transfer is complete
    await set(clubRef, null);

    // set approved true
    const approvedRef = dbRef($db, `member/${info.name}/approved/`);
    set(approvedRef, true);
  }

  isActive.value = false;
};

function send(item, i) {
  const memberNotifRef = dbRef($db, `member/${i}/notification/`);
  push(memberNotifRef, {
    message: `"${Object.values(item ?? {})[0]}"에 대한 답: "${answer.value}""`,
  });

  const questionRef = dbRef($db, `clubs/${clubName}/message/${i}`);
  set(questionRef, null);

  answer.value = "";
}
</script>
