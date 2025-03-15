export const greetUser = () => {
  const date = new Date();
  const hours = date.getHours();
  let greeting = '';
  if (hours < 12) {
    greeting = 'Good Morning';
  } else if (hours < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }
  return greeting;
};
