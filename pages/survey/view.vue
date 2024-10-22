<template>
  <div class="mx-4" style="width: 100%">
    <br />

    <h1 class="text-center">{{ clubName }}</h1>
    <h3 class="text-center">
      {{ clubInfo.leader }} ·
      {{ clubInfo.coleader }}
    </h3>

    <br />

    <div class="d-flex justify-center">
      <v-rating
        :model-value="
          roundRating(listInfo.totalAccumulation, listInfo.totalCount)
        "
        color="amber"
        readonly
        half-increments
        size="x-large"
      ></v-rating>
    </div>

    <v-table style="border: 1px solid black" class="rounded-lg">
      <thead>
        <tr style="background-color: skyblue">
          <th style="min-width: 100px">카테고리</th>
          <th>정보</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>등수</td>
          <td>{{ place }}</td>
        </tr>
        <tr>
          <td>설문 수</td>
          <td>{{ listInfo.totalCount }}명</td>
        </tr>
        <tr>
          <td>평균 점수</td>
          <td>
            {{ roundRating(listInfo.totalAccumulation, listInfo.totalCount) }}점
          </td>
        </tr>
      </tbody>
    </v-table>

    <br /><br />

    <h2 class="text-center mb-2">후기 보기</h2>
    <v-card
      v-for="(review, index) in Object.values(listInfo.list ?? {})"
      :key="Object.keys(listInfo.list ?? {})[index]"
      variant="outlined"
    >
      <template v-slot:prepend>
        <img :src="review.photoURL" style="width: 50px; height: 50px" />
      </template>
      <template v-slot:title>
        <v-card-title>
          {{ review.review }}
        </v-card-title>
        <v-card-subtitle> 평점: {{ review.rating }} </v-card-subtitle>
      </template>
    </v-card>
  </div>
</template>

<script setup>
import { get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const clubInfo = ref({
  leader: "",
  coleader: "",
});
const listInfo = ref([]);
const account = ref(null);
const joining = ref({
  name: "",
  email: "",
  photoURL: "",
});
const typeofAccount = ref("");
const dialog = ref(false);

const { $auth, $db } = useNuxtApp();
const route = useRoute();
const clubName = route.query.clubname;
const place = route.query.place;

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

  const listRef = dbRef($db, `survey/${clubName}`);
  await onValue(listRef, (snapshot) => {
    listInfo.value = snapshot.val();
  });
});
</script>
