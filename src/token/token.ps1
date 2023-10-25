$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Content-Type", "application/x-www-form-urlencoded")
$body = "grant_type=client_credentials&client_id=3bd63d40-22c3-446e-b8b7-808c157d11d8&client_secret=hvK8Q~YdHXaQpMkUUtdz8PpWKaA6~OEV2mbwsbuK&resource=https%3A%2F%2Ffarmbeats.azure.net"
$response = Invoke-RestMethod '
https://login.microsoftonline.com/c6c1e9da-5d0c-4f8f-9a02-3c67206efbd6/oauth2/token' -Method 'POST' -Headers $headers -Body $body
$response | ConvertTo-Json