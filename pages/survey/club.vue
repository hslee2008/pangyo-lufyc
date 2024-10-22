<template>
  <div class="mx-4" style="width: 100%">
    <br />

    <h1 class="text-center">{{ clubName }}</h1>
    <h3 class="text-center">
      {{ clubInfo.leader }} ·
      {{ clubInfo.coleader }}
    </h3>

    <br />

    <div class="text-center">
      <v-rating v-model="rating" size="x-large" clearable></v-rating>

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
          <v-btn color="primary" block rounded to="/club">닫기</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

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

const { $auth, $db } = useNuxtApp();
const route = useRoute();
const clubName = route.query.clubname;

function submit() {
  const surveyed = dbRef($db, `survey/${clubName}/list/${account.value.uid}`);
  set(surveyed, {
    name: joining.value.name,
    email: joining.value.email,
    photoURL: joining.value.photoURL,
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

onMounted(async () => {
  onAuthStateChanged($auth, (user) => {
    account.value = user;
    joining.value.name = user.displayName;
    joining.value.email = user.email;
    joining.value.photoURL = user.photoURL;

    onValue(
      dbRef($db, `everyone/${account.value.displayName}/type`),
      (snapshot) => {
        typeofAccount.value = snapshot.val();
      }
    );
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
