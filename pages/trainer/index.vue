<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const { data: trainers, refresh } = await useTrainers();
//やめるボタンを追加 sy2025
const goHome = () => {
  router.push("..");
};
//トレーナーの削除ボタンを追加 sy2025
const onDelete = async (trainer) => {
  const response = await $fetch(`/api/trainer`, {
    baseURL: config.public.backendOrigin,
    method: "DELETE",
    body: {
      name: trainer,
    },
  }).catch((e) => e);
  if (response instanceof Error) return;
  await refresh();
  onClose();
};
const { dialog, onOpen, onClose } = useDialog();
</script>

<template>
  <div>
    <h1>つづきからはじめる</h1>
    <!--やめるボタンを追加 sy2025-->
    <GamifyButton type="button" @click="goHome">
        やめる
    </GamifyButton>
    <GamifyList>
      <GamifyItem v-for="trainer in trainers" :key="trainer">
        <span class="trainer-name"><NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink></span>
        <!--トレーナー削除ボタンを追加 sy2025-->
        <GamifyButton @click="onOpen(trainer)">さくじょする</GamifyButton>
      </GamifyItem>
    </GamifyList>
    <GamifyDialog
      v-if="dialog"
      id="confirm-delete"
      title="かくにん"
      :description="`ほんとうに　${dialog}　を　さくじょするんだな！　この　そうさは　とりけせないぞ！`"
      @close="onClose"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onClose">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onDelete(dialog)">はい</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
  </div>
</template>
