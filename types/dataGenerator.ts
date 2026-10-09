export function generateUser() {
  const id = Date.now().toString();

  return {
    firstName: 'Sahil',
    lastName: 'Chauhan',
    street: 'Higna T Point',
    city: 'Nagpur',
    state: 'MH',
    zipCode: '440016',
    phone: '9' + id.slice(-9),
    ssn: id.slice(-9),
    username: 'sahil' + id,
    password: 'Test@1234',
  };
}