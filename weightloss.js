(() => {
  const slider = document.querySelector('#weight-range');
  const currentWeight = document.querySelector('#current-weight');
  if (slider && currentWeight) {
    const syncWeight = () => { currentWeight.textContent = `${slider.value} lbs`; };
    slider.addEventListener('input', syncWeight);
    syncWeight();
  }
})();
