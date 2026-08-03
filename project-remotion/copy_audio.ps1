$map = @{
  "1" = "2ae581fb-d1a5-4c87-9d6f-f4c274573794"
  "2" = "5eea1e54-7a75-4630-b069-5ab479642a19"
  "3" = "cd291453-4785-477c-b06d-0c7dd5de4e0d"
  "4" = "40f4ad50-7a64-4e8f-ae94-b833012db71a"
  "5" = "8f63a1c8-5a17-444d-bc4c-55f398a287db"
  "6" = "057f1b4a-8a03-40dd-85f1-b6f35b0ffbaf"
  "7" = "93324874-5fa7-4e15-8eaf-da5980a7fe9c"
  "8" = "1b376c22-f97d-4c6e-993d-0cd46e60a436"
  "9" = "09e80479-6879-435b-b950-68487944350f"
  "10" = "3acfd770-a7fc-4ac3-ac71-861ee3dca561"
  "11" = "89c3b669-afc1-4ece-a159-1e6df36906b4"
  "12" = "c43d8d72-f83d-409f-84aa-45c22f964215"
  "13" = "8d733ff6-443a-4d13-989a-51e14b859738"
  "14" = "c1fe0e78-fdeb-4879-a38d-061e3691762b"
  "15" = "726449c5-7b5b-41e7-aa8e-7f281bc7888c"
  "16" = "d68977f9-77d2-4d86-a25c-a535746947aa"
  "17" = "020887a3-ce91-410d-8d41-91f8dc3362a3"
  "18" = "8b0bd4c1-36b0-4cc6-9586-ef4c0b27f9a0"
  "19" = "995efc59-7e65-462d-84d2-50d912f142b6"
  "20" = "70a1b264-7324-443e-9627-1b72a7aa6a8e"
  "21" = "e79ffac2-4088-4426-9ed2-e1cc4f6a8351"
  "22" = "b978fdf9-2189-46f6-941a-463879c4719f"
  "23" = "7f144515-69e5-45c7-8faa-85d1ece90247"
  "24" = "bd6bd730-8173-4143-a33d-1538093ac65c"
  "25" = "cd61362e-eda6-4cdd-910b-d4c7c6064578"
  "26" = "0bd9962b-b278-4eec-b4d1-a110d47535e0"
  "27" = "a614e6c0-29c0-4634-8b4b-26e721c0ede5"
  "28" = "efcb89c6-16e0-4137-bb1f-ee260b663a5c"
  "29" = "5b7d5800-98eb-467c-9856-c2e66f49128a"
  "30" = "0f1f5118-f7e6-429a-905f-1be3e32ea31e"
  "31" = "50fa8316-9840-4bc8-9710-2203c127aab5"
  "32" = "12445129-7977-42a7-93a6-db146f37f8e6"
}

$sourceDir = "C:\Users\mrubi\AppData\Roaming\sh.voicebox.app\generations"
$destDir = "public\templates\storytime-summary\audio"
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir }

$pending = 32
while ($pending -gt 0) {
  $pending = 0
  foreach ($key in $map.Keys) {
    $id = $map[$key]
    $srcFile = "$sourceDir\$id.wav"
    $destFile = "$destDir\vo_scene_$key.wav"
    if (-not (Test-Path $destFile)) {
      if (Test-Path $srcFile) {
        Copy-Item $srcFile $destFile -Force
        Write-Host "Copied scene $key ($id)"
      } else {
        $pending++
      }
    }
  }
  if ($pending -gt 0) {
    Write-Host "Waiting for $pending files to complete generation..."
    Start-Sleep -Seconds 5
  }
}
Write-Host "ALL 32 AUDIO FILES SUCCESSFULLY COPIED!"
