# 创建tabBar图标脚本
$outputDir = "./assets/icons"

# 确保目录存在
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# 创建简单的81x81像素PNG图标
function Create-Icon($name, $r, $g, $b) {
    $path = Join-Path $outputDir $name
    
    # .NET创建位图
    $bitmap = New-Object System.Drawing.Bitmap(81, 81)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # 填充颜色
    $color = [System.Drawing.Color]::FromArgb($r, $g, $b)
    $brush = New-Object System.Drawing.SolidBrush($color)
    $graphics.FillRectangle($brush, 0, 0, 81, 81)
    
    # 保存为PNG
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # 清理资源
    $brush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Created: $name"
}

# 创建图标
Create-Icon "home.png" 153 153 153
Create-Icon "home-active.png" 255 140 56
Create-Icon "ai.png" 153 153 153
Create-Icon "ai-active.png" 255 140 56
Create-Icon "map.png" 153 153 153
Create-Icon "map-active.png" 255 140 56
Create-Icon "profile.png" 153 153 153
Create-Icon "profile-active.png" 255 140 56

Write-Host "All icons created successfully!"
