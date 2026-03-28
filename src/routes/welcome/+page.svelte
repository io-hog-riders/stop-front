<script lang="ts">
	import { goto } from '$app/navigation';
	import WelcomeTopBar from '$lib/components/welcome/WelcomeTopBar.svelte';
	import WelcomeSideRail from '$lib/components/welcome/WelcomeSideRail.svelte';
	import WelcomeProgress from '$lib/components/welcome/WelcomeProgress.svelte';
	import WelcomeBottomActions from '$lib/components/welcome/WelcomeBottomActions.svelte';

	import IdentityStep from '$lib/components/welcome/steps/IdentityStep.svelte';
	import VehicleStep from '$lib/components/welcome/steps/VehicleStep.svelte';
	import ExperienceStep from '$lib/components/welcome/steps/ExperienceStep.svelte';
	import AccountStep from '$lib/components/welcome/steps/AccountStep.svelte';

	let currentStep = $state(1);
	const totalSteps = 4;

	let progress = $derived((currentStep / totalSteps) * 100);

	function handleNext() {
		if (currentStep < totalSteps) {
			currentStep++;
		} else {
			goto('/map');
		}
	}

	function handleBack() {
		if (currentStep > 1) {
			currentStep--;
		}
	}
</script>

<svelte:head>
	<title>STOPFINDER - Prototype</title>
</svelte:head>

<WelcomeTopBar />
<WelcomeSideRail {currentStep} />
<WelcomeProgress {progress} />

<main class="relative flex-1 px-6 md:ml-64 md:px-12">
	<div class="relative mx-auto max-w-5xl pt-4">
		<div
			class="absolute top-0 right-0 z-10 bg-white p-2 text-[10px] font-black tracking-tighter text-black uppercase"
		>
			QUESTION_MODULE_0{currentStep}
		</div>

		{#if currentStep === 1}
			<IdentityStep />
		{:else if currentStep === 2}
			<VehicleStep />
		{:else if currentStep === 3}
			<ExperienceStep />
		{:else if currentStep === 4}
			<AccountStep />
		{/if}
	</div>
</main>

<WelcomeBottomActions
	showBack={currentStep > 1}
	onBack={handleBack}
	onContinue={handleNext}
	continueLabel={currentStep === totalSteps ? 'Join the Road' : 'Continue'}
/>
