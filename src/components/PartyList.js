import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import partiesData  from '../data/parites.json'

function PartyList({ onPartySelect }) {
  const [parties, setParties] = useState([]);

  

  useEffect(() => {
    console.log('result')
    setParties(partiesData);
    const requestURL = 'https://adma.farmbeats.azure.net';
    
    const token = 'Bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiJodHRwczovL2Zhcm1iZWF0cy5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jNmMxZTlkYS01ZDBjLTRmOGYtOWEwMi0zYzY3MjA2ZWZiZDYvIiwiaWF0IjoxNjk4MjM2ODk5LCJuYmYiOjE2OTgyMzY4OTksImV4cCI6MTY5ODI0MDc5OSwiYWlvIjoiRTJGZ1lQaGF0VnpzNXJ0YUVhOVZsM3ZmcjJDYkFnQT0iLCJhcHBpZCI6IjNiZDYzZDQwLTIyYzMtNDQ2ZS1iOGI3LTgwOGMxNTdkMTFkOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2M2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNi8iLCJvaWQiOiJjMTg1Y2ZjMy0xNTE5LTQzOWQtOTBlNS0zMzM3MmUzNjIxMjEiLCJyaCI6IjAuQVVrQTJ1bkJ4Z3hkajAtYUFqeG5JRzc3MXNXVHVMRWNyb3RCbUpNTGVNQkNKYlJKQUFBLiIsInN1YiI6ImMxODVjZmMzLTE1MTktNDM5ZC05MGU1LTMzMzcyZTM2MjEyMSIsInRpZCI6ImM2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNiIsInV0aSI6InlrTDY4N3dhUFVXU0ptdXBJZTBkQUEiLCJ2ZXIiOiIxLjAifQ.PkNiV7vWBOcsQyVb0SvJTM6TtDvh9rbZun-JKpyXmWUixj9Kb-lHX3wElVtQq8zLX-TyTCc6Sl1B8LHRR5qbuggaccFSHv3VDqGPfNjAduHg9Au_2lNTypm0CinRjgm4YZoCNtyXeQIpa4R0tdIOnybreuc4QB0oeXoTfy3blDwmJ5qbc9-0QGrqJC_LNEdEXuZzHBwUNDqxVRxyZz0bKRs-dCCDtj496ApaqIkCTIeM4njS_AHxEmkWdyQ7ig2J6Bg8DKJeqseVjJQwj9cIzBwg8PihI26v227ECAxK2P7me109W6bhMugJJqKnGWMBRN7dYN2pD-EiKGZGFKsUjA";
    // Define your custom headers
    const headers = {
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json',
        'api-version': '2022-11-01-preview',
        //'Access-Control-Allow-Origin': '*'
    };

    const instance = axios.create({
        baseURL: requestURL, // Replace with your API URL
        headers: {
          'Access-Control-Allow-Origin': '*', // Or specify allowed origins
          // Add other headers as needed
          'Authorization':'Bearer '+token,
          'Content-Type': 'application/json',
          'api-version': '2022-11-01-preview'
        },
    });
    
    instance.get('/parties')
    .then((response) => {
      console.log('response', response)
      //setParties(partiesData);
    })
    .catch((error) => {
      console.error('Error fetching party data:', error);
    });
    
    
        /*
    const client = FarmBeats(
        "https://adma.farmbeats.azure.net",
        new DefaultAzureCredential({
            clientId: '3bd63d40-22c3-446e-b8b7-808c157d11d8',
            clientSecret: 'hvK8Q~YdHXaQpMkUUtdz8PpWKaA6~OEV2mbwsbuK',
            tenantId: 'c6c1e9da-5d0c-4f8f-9a02-3c67206efbd6',
            tokenCachePersistenceOptions: {
              name: 'myTokenCache', // Optional
              // Other token cache options
            }
        })
      );
    const response = client.path("/parties").get({
        'Content-Type': 'application/json',
        'api-version': '2022-11-01-preview',
    }).then((data) => {
        console.log('resultss', data);
    })

    
    console.log('result', response);
    */
   /*
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiJodHRwczovL2Zhcm1iZWF0cy5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jNmMxZTlkYS01ZDBjLTRmOGYtOWEwMi0zYzY3MjA2ZWZiZDYvIiwiaWF0IjoxNjk4MjIyNjU2LCJuYmYiOjE2OTgyMjI2NTYsImV4cCI6MTY5ODIyNjU1NiwiYWlvIjoiRTJGZ1lHQmZmZkhsK2QvTTNkR09XUnBYTTIyZEFRPT0iLCJhcHBpZCI6IjNiZDYzZDQwLTIyYzMtNDQ2ZS1iOGI3LTgwOGMxNTdkMTFkOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2M2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNi8iLCJvaWQiOiJjMTg1Y2ZjMy0xNTE5LTQzOWQtOTBlNS0zMzM3MmUzNjIxMjEiLCJyaCI6IjAuQVVrQTJ1bkJ4Z3hkajAtYUFqeG5JRzc3MXNXVHVMRWNyb3RCbUpNTGVNQkNKYlJKQUFBLiIsInN1YiI6ImMxODVjZmMzLTE1MTktNDM5ZC05MGU1LTMzMzcyZTM2MjEyMSIsInRpZCI6ImM2YzFlOWRhLTVkMGMtNGY4Zi05YTAyLTNjNjcyMDZlZmJkNiIsInV0aSI6IjhpWk16RUlmaDBXRkluTFU4a0lWQUEiLCJ2ZXIiOiIxLjAifQ.Czp5HQ96i-FtmNbXB9kRyZhdTAuMmhXIXSyFWRhgIrSaT8jvmpon5jfGuMM1-n2VC8Z6LFqJMVtXXxIlyVffBEUXfzJLeWkZ1S9BtEp09AmZ0yIDOLbZ_2SDrlP_Ypf3LrQFa6BMVtu_iIqibSOf4StqKn8eoQx4iwCRJtFX-AA2ojX1UZT_NcHpGqqnLvlNWrWizMqhC4C0nrblHS6iqKf7Cvndkfpw-LouS4kySgY5QcqyTa_szYYYx57OhiEUZFH6LOaaS2kCE03jW94l07NBeGRh5xa49HpeYHJPNqsvQzAFnP0dolXIOU9UbB84R0_eqyvnA1ofRm3pbH6oRQ";
    // Define your custom headers
    
    const headers = {
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json',
        //  'api-version': '2022-11-01-preview',
        //'Access-Control-Allow-Origin': '*'
    };
    
    
   
      */
      
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        List of Parties
      </Typography>
      <List>
        {parties.map((party) => (
            <Box
                key={party.id}
                borderColor="primary.main"
                borderWidth={1}
                borderStyle="solid"
                borderRadius={4}
                p={2}
                m={1}
                onClick={() => onPartySelect(party)
                }
            >
            <ListItem>
              <ListItemText primary={party.name} secondary={party.date} />
            </ListItem>
          </Box>
        ))}
      </List>
    </div>
  );
}

export default PartyList;
