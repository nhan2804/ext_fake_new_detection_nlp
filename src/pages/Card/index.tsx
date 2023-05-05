import { Card, Grid, Text, Link } from '@nextui-org/react'
import React from 'react'

const index = ({ title, desc, link }: any): any => {
  return (
    <Card css={{ p: '$6', mw: '400px', mb: 10 }}>
      <Card.Header>
        <img
          alt="nextui logo"
          src="https://assets.stickpng.com/images/5aa78e207603fc558cffbf19.png"
          width="34px"
          height="34px"
        />
        <Grid.Container css={{ pl: '$6' }}>
          <Grid xs={12}>
            <Text css={{ color: '$accents8' }}>Verified</Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: '$2' }}>
        <Text h4>{title}</Text>
      </Card.Body>
      <Card.Footer>
        <Link color="primary" target="_blank" href={link}>
          {link}
        </Link>
      </Card.Footer>
    </Card>
  )
}

export default index
