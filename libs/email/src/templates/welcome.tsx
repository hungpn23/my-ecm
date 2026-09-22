import { Body, Container, Head, Heading, Html, Preview, Text } from "react-email";

export function Welcome() {
  const title = "Welcome to My Ecommerce";

  return (
    <Html lang="en">
      <Head />
      <Preview>{title}</Preview>
      <Body>
        <Container>
          <Heading>{title}</Heading>
          <Text>Your account is ready.</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default Welcome;
