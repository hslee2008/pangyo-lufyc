<template>
  <div class="page-container mx-4">
    <h1 class="text-center club-title">{{ clubName }}</h1>
    <h3
      v-if="clubName === '머큐리 바이오메드'"
      class="text-center club-leaders"
    >
      2109 백승휴 / 2827 한재윤 · 2313 복진서 / 2725 최인용
    </h3>
    <h3 v-else class="text-center club-leaders">
      {{ clubInfo?.leader }} · {{ clubInfo?.coleader }}
    </h3>

    <div v-if="clubInfo?.description" class="club-description">
      {{ clubInfo?.description }}
      <br />
    </div>

    <div class="review-section text-center">
      <v-rating
        v-model="rating"
        size="x-large"
        clearable
        half-increments
        color="amber"
      ></v-rating>

      <v-textarea
        v-model="review"
        variant="outlined"
        placeholder="후기를 남겨주세요"
        class="review-textarea"
      ></v-textarea>
      <v-alert class="text-left">
        후기를 남기면 학번, 이름이 공개됩니다. 평점은 공개되지 않습니다.
      </v-alert>

      <br />

      <v-btn color="primary" block rounded @click="submit">제출</v-btn>
    </div>

    <v-dialog v-model="dialog" persistent>
      <v-card class="confirmation-dialog">
        <v-card-title class="text-center">설문이 끝났습니다</v-card-title>
        <v-card-text class="dialog-actions">
          <v-card
            variant="tonal"
            prepend-icon="mdi-link"
            title="설문 결과 보기"
            subtitle="다른 동아리 설문 보기"
            to="/survey/result"
          ></v-card>
          <v-card
            variant="tonal"
            prepend-icon="mdi-chevron-left"
            title="돌아가기"
            to="/survey/select"
          ></v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="notloggedin" persistent>
      <v-card @click="login" class="login-dialog">
        <v-card-title class="text-center">
          <v-icon start>mdi-google</v-icon> 로그인하기
        </v-card-title>
        <v-card-subtitle class="text-center mb-3">
          판교고 계정으로 로그인하기.<br />
          다른 계정이면 로그인할 수 없습니다.
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <v-dialog v-model="matched" persistent>
      <v-card>
        <v-card-title class="text-center">
          소속 동아리 설문 참여 불가
        </v-card-title>
        <v-card-text>
          <v-table class="user-info-table">
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
        <v-card-actions class="mb-3 d-flex justify-center">
          <v-card
            variant="tonal"
            prepend-icon="mdi-open-in-new"
            title="다른 동아리"
            subtitle="다른 동아리 설문하기"
            to="/survey/select"
          ></v-card>
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

const router = useRouter();

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
        router.go(0);
      }
    })
  );

  if (
    checkIfMember(account.value.displayName) === clubName ||
    clubName.includes(checkIfMember(account.value.displayName))
  ) {
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

    if (
      checkIfMember(account.value.displayName) === clubName ||
      clubName.includes(checkIfMember(account.value.displayName))
    ) {
      matched.value = true;
    } else {
      matched.value = false;
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

<style scoped>
.page-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 8px;
}

.club-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 16px;
  color: #333;
}

.club-leaders {
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-top: 4px;
}

.club-description {
  font-size: 14px;
  color: #666;
  margin: 16px 0;
  padding: 12px;
  background-color: #f1f1f1;
  border-radius: 4px;
}

.review-section {
  margin-top: 20px;
}

.review-textarea {
  width: 100%;
  margin-top: 12px;
  background-color: #fff;
  border-radius: 4px;
}

.v-btn {
  margin-top: 16px;
}

.confirmation-dialog,
.login-dialog {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
}

.dialog-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-info-table td {
  padding: 8px;
  color: #333;
}

.v-btn[block] {
  width: 100%;
  margin-top: 8px;
}
</style>
