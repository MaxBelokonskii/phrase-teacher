<script setup lang="ts">
import { computed } from 'vue'
import {
  Hand,
  Plane,
  Bus,
  BedDouble,
  Utensils,
  Coffee,
  ShoppingBag,
  Landmark,
  Wallet,
  ShieldAlert,
  HeartHandshake,
  Compass,
  Droplets,
  MessageCircleWarning,
  Users,
  CloudSun,
  HelpCircle,
} from 'lucide-vue-next'

const ICONS: Record<string, unknown> = {
  hand: Hand,
  plane: Plane,
  bus: Bus,
  'bed-double': BedDouble,
  utensils: Utensils,
  coffee: Coffee,
  'shopping-bag': ShoppingBag,
  landmark: Landmark,
  wallet: Wallet,
  'shield-alert': ShieldAlert,
  'heart-handshake': HeartHandshake,
  compass: Compass,
  droplets: Droplets,
  'message-circle-warning': MessageCircleWarning,
  users: Users,
  'cloud-sun': CloudSun,
}

interface Props {
  name: string
  class?: string
}

const props = defineProps<Props>()

const Component = computed(() => ICONS[props.name] ?? HelpCircle)
</script>

<template>
  <component :is="Component as any" :class="props.class" aria-hidden="true" />
</template>
