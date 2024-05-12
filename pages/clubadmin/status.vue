<template>
  <div class="mx-4">
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
      {{ clubInfo.leader }} ·
      {{ clubInfo.coleader }}
    </h3>

    <br />

    <v-table style="border: 1px solid black" class="rounded-lg">
      <thead>
        <tr style="background-color: skyblue">
          <th class="text-left">카테고리</th>
          <th class="text-left">정보</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>최대 모집 인원 수</td>
          <td>{{ clubInfo.memberNumber }}</td>
        </tr>
        <tr>
          <td>현재 총 지원자 수</td>
          <td>{{ Object.keys(clubInfo.joining ?? {}).length }}</td>
        </tr>
        <tr>
          <td>현재 1학년 지원자 수</td>
          <td>
            {{
              Object.keys(clubInfo.joining ?? {}).filter((a) =>
                a.startsWith("1")
              ).length
            }}
          </td>
        </tr>
        <tr>
          <td>현재 2학년 지원자 수</td>
          <td>
            {{
              Object.keys(clubInfo.joining ?? {}).filter((a) =>
                a.startsWith("2")
              ).length
            }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <br /><br />
    <hr />
    <br /><br />

    <div>
      <h2>지원자 확인하기</h2>
      <div class="d-flex">
        <v-checkbox v-model="see1" label="1학년"></v-checkbox>
        <v-checkbox v-model="see2" label="2학년"></v-checkbox>
      </div>

      <v-list bg-color="grey-lighten-3" class="rounded-lg">
        <v-dialog
          v-for="person in Object.keys(clubInfo.joining ?? {}).filter((a) => {
            if (see1 && see2) return true;
            else if (see1) return a.startsWith(1);
            else if (see2) return a.startsWith(2);
          })"
          :key="clubInfo.joining[person].name"
          max-width="500"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-list-item
              v-bind="activatorProps"
              :prepend-avatar="clubInfo.joining[person].photoURL"
            >
              <v-list-item-title>
                {{ clubInfo.joining[person].name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ clubInfo.joining[person].email }} /
                {{ clubInfo.joining[person].phone }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card :title="clubInfo.joining[person].name">
              <v-card-text>
                지원동기: {{ clubInfo.joining[person].whyJoined }}
              </v-card-text>

              <v-card-actions class="mx-10 mb-3">
                <v-btn
                  text="불합격"
                  color="red"
                  variant="tonal"
                  @click="() => notJoining(clubInfo.joining[person], isActive)"
                ></v-btn>

                <v-spacer></v-spacer>

                <v-btn
                  text="합격"
                  color="green"
                  variant="tonal"
                  @click="() => joining(clubInfo.joining[person], isActive)"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-list>
    </div>

    <br /><br />
    <hr />
    <br /><br />

    <div>
      <h2>동아리원 확인하기</h2>
      <div class="d-flex">
        <v-checkbox v-model="see1" label="1학년"></v-checkbox>
        <v-checkbox v-model="see2" label="2학년"></v-checkbox>
      </div>

      <v-list bg-color="grey-lighten-3" class="rounded-lg">
        <v-list-item
          v-for="person in Object.keys(clubInfo.accepted ?? {}).filter((a) => {
            if (see1 && see2) return true;
            else if (see1) return a.startsWith(1);
            else if (see2) return a.startsWith(2);
          })"
          :key="clubInfo.accepted[person].name"
          :prepend-avatar="clubInfo.accepted[person].photoURL"
        >
          <v-list-item-title>
            {{ clubInfo.accepted[person].name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ clubInfo.accepted[person].email }} /
            {{ clubInfo.accepted[person].phone }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
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

const see1 = ref(true);
const see2 = ref(true);

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
      message: `축하합니다. ${clubName} 동아리에 합격하였습니다.`,
    });

    console.log(data);
    const acceptedRef = dbRef($db, `clubs/${clubName}/accepted/${info.name}`);
    await set(acceptedRef, data);

    // Remove from joining database after data transfer is complete
    await set(clubRef, null);

    // set approved true
    const approvedRef = dbRef($db, `member/${info.name}/approved/`);
    set(approvedRef, true);

    // set approved true
    const clubNameRef = dbRef($db, `member/${info.name}/club/`);
    set(clubNameRef, clubName);
  }

  isActive.value = false;
};
</script>
