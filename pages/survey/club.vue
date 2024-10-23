<template>
  <div class="mx-4" style="width: 100%">
    <br />

    <h1 class="text-center">{{ clubName }}</h1>
    <h3 class="text-center">
      {{ clubInfo.leader }} ·
      {{ clubInfo.coleader }}
    </h3>

    <br />

    <div>
      {{ clubInfo.description }}
    </div>

    <br />

    <div class="text-center">
      <v-rating
        v-model="rating"
        size="x-large"
        clearable
        half-increments
        color="amber"
      ></v-rating>

      <br />

      <v-textarea
        v-model="review"
        variant="outlined"
        placeholder="후기를 남겨주세요"
      ></v-textarea>

      <br />

      <v-btn color="primary" block rounded @click="submit">제출</v-btn>
    </div>

    <br />

    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card class="pt-3">
        <v-card-title class="text-center text-h5">
          설문이 끝났습니다
        </v-card-title>
        <v-card-text>
          <v-btn class="mb-2" color="green" block rounded to="/survey/result"
            >결과보기</v-btn
          >
          <v-btn color="primary" block rounded to="/survey/select">닫기</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="notloggedin" persistent>
      <v-card @click="login" class="pb-3">
        <div class="d-flex justify-center align-center">
          <div>
            <v-card-title>
              <v-icon start>mdi-google</v-icon> 로그인하기
            </v-card-title>
            <v-card-subtitle>판교고 계정으로 로그인하기</v-card-subtitle>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="matched" persistent>
      <v-card @click="login">
        <v-card-title class="text-center">
          자신의 동아리에 설문 참여 불가
        </v-card-title>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td>학번, 이름</td>
                <td>{{ account?.displayName }}</td>
              </tr>
              <tr>
                <td>소속 동아리</td>
                <td>{{ checkIfMember(account?.displayName) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-card-actions class="d-flex justify-center">
          <v-btn color="primary" black variant="tonal" to="/survey/select">
            다른 동아리 검색하기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { get } from "firebase/database";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

const clubInfo = ref({
  leader: "",
  coleader: "",
});
const rating = ref(0);
const account = ref(null);
const joining = ref({
  name: "",
  email: "",
  photoURL: "",
});
const typeofAccount = ref("");
const review = ref("");
const dialog = ref(false);
const notloggedin = ref(false);
const matched = ref(false);

const { $auth, $db } = useNuxtApp();
const route = useRoute();
const clubName = route.query.clubname;

function submit() {
  const surveyed = dbRef($db, `survey/${clubName}/list/${account.value.uid}`);
  set(surveyed, {
    name: joining.value.name,
    email: joining.value?.email,
    photoURL: joining.value?.photoURL,
    rating: rating.value,
    review: review.value,
  });

  const tc = dbRef($db, `survey/${clubName}/totalCount`);
  const ta = dbRef($db, `survey/${clubName}/totalAccumulation`);

  get(tc).then((snapshot) => {
    const count = snapshot.val();
    if (count === null) set(tc, 1);
    else set(tc, count + 1);
  });

  get(ta).then((snapshot) => {
    const accumulation = snapshot.val();
    if (accumulation === null) set(ta, rating.value);
    else set(ta, accumulation + rating.value);
  });

  dialog.value = true;
}

const login = async () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup($auth, provider).then(() =>
    onAuthStateChanged($auth, async (user) => {
      account.value = user;

      if (!user?.email?.includes("pangyo.hs.kr")) return;
      if (account.value == null) {
        notloggedin.value = true;
      } else {
        notloggedin.value = false;
        window.reload()
      }
    })
  );

  if (checkIfMember(account.value.displayName) === clubName) {
    matched.value = true;
  } else {
    matched.value = false;
  }

  const type = dbRef($db, `/everyone/${user?.displayName}/type`);
  onValue(type, (snapshot) => (typeofAccount.value = snapshot.val()));

  if (account.value.accountType === "teacher") {
    matched.value = false;
  }

};

onMounted(async () => {
  onAuthStateChanged($auth, (user) => {
    account.value = user;
    joining.value.name = user?.displayName;
    joining.value.email = user?.email;
    joining.value.photoURL = user?.photoURL;

    onValue(
      dbRef($db, `everyone/${account.value?.displayName}/type`),
      (snapshot) => {
        typeofAccount.value = snapshot.val();
      }
    );

    console.log(account.value?.displayName);
    console.log(checkIfMember(account.value?.displayName));
    console.log(clubName);
    console.log(checkIfMember(account.value?.displayName) === clubName);
    if (checkIfMember(account.value?.displayName) === clubName) {
      matched.value = true;
    }

    if (account.value == null) {
      notloggedin.value = true;
    }
  });

  const clubRef = dbRef($db, `clubs/${clubName}`);
  await onValue(clubRef, (snapshot) => (clubInfo.value = snapshot.val()));

  const listRef = dbRef($db, `survey/${clubName}/list`);
  await onValue(listRef, (snapshot) => {
    const list = snapshot.val();
    if (list !== null && list[account.value.uid] !== undefined) {
      dialog.value = true;
    }
  });
});
</script>
