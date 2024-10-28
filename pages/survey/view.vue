<template>
  <div class="page-container mx-4">
    <h1 class="text-center">{{ clubName }}</h1>
    <h3 class="text-center club-leaders">
      {{ clubInfo?.leader }} · {{ clubInfo?.coleader }}
    </h3>

    <br />

    <div v-if="clubInfo.description" class="club-description">
      {{ clubInfo.description }}
    </div>

    <div class="d-flex justify-center my-4">
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

    <v-table class="club-info-table rounded-lg">
      <thead>
        <tr>
          <th class="text-center">카테고리</th>
          <th class="text-center">정보</th>
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

    <h2 class="text-center reviews-title">후기 보기</h2>
    <div
      v-if="
        Object.values(listInfo.list ?? {}).filter((review) => review.review)
          .length > 0
      "
      class="reviews-section"
    >
      <v-card
        v-for="(review, index) in Object.values(listInfo.list ?? {})"
        v-show="review.review"
        :key="Object.keys(listInfo.list ?? {})[index]"
        variant="tonal"
        class="review-card"
      >
        <template v-slot:prepend>
          <img
            :src="review.photoURL"
            class="review-image mr-3"
            style="outline: 1px solid black"
          />
        </template>
        <template v-slot:title>
          <v-card-subtitle>
            {{ review.name }}
          </v-card-subtitle>
          <v-card-title class="review-text">
            {{ review.review }}adf
          </v-card-title>
        </template>
      </v-card>
    </div>
    <v-card v-else variant="tonal">
      <v-card-title class="text-center">후기가 아직 없습니다.</v-card-title>
    </v-card>

    <br /><br />
    <br /><br />

    <v-card
      variant="tonal"
      prepend-icon="mdi-chevron-left"
      title="다른 동아리 설문 결과"
      subtitle="돌아가기"
      to="/survey/result"
    ></v-card>

    <br /><br />
  </div>
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";
import { ref as dbRef, onValue } from "firebase/database";

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

const { $auth, $db } = useNuxtApp();
const route = useRoute();
const clubName = route.query.clubname;
const place = route.query.place;

function roundRating(totalAccumulation, totalCount) {
  return totalCount ? (totalAccumulation / totalCount).toFixed(1) : 0;
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

  const listRef = dbRef($db, `survey/${clubName}`);
  await onValue(listRef, (snapshot) => {
    listInfo.value = snapshot.val();
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

.club-info-table {
  width: 100%;
  margin-top: 20px;
  background-color: #fff;
  border-collapse: collapse;
}

.club-info-table th {
  background-color: skyblue;
  font-weight: bold;
  padding: 8px;
  text-align: center;
  border: 1px solid #ccc;
}

.club-info-table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ccc;
  color: #555;
}

.reviews-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin: 24px 0 16px;
}

.reviews-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  padding: 12px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.review-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.review-rating {
  font-size: 14px;
  color: #777;
  margin-top: 4px;
}
</style>
