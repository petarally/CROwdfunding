<template>
    <div class="main-view">
        <ListingCard
            :campaignImage="require('@/assets/listing_img_test_1.jpg')"
            :campaignName="'Naziv kampanje'"
            :campaignDetails="'Opis kampanje'"
            :moneyNeeded="700"
            :daysLeft="184"
        />
        <ListingCard
            :campaignImage="require('@/assets/listing_img_test_2.jpg')"
            :campaignName="'Naziv kampanje'"
            :campaignDetails="'Opis kampanje'"
            :moneyNeeded="700"
            :daysLeft="184"
        />
        <ListingCard
            :campaignImage="require('@/assets/listing_img_test_3.jpg')"
            :campaignName="'Naziv kampanje'"
            :campaignDetails="'Opis kampanje'"
            :moneyNeeded="700"
            :daysLeft="184"
        />
    </div>
</template>

<script>
import ListingCard from '@/components/ListingCard.vue';

export default {
    components: {
        ListingCard
    }
}
</script>

<style>
.main-view {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 20px;
}
</style>