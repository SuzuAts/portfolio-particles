/* 日本語コメント:
  Canvas ベースのパーティクルシステム
  - マウス追従: ポインタに引かれる軽い挙動
  - 線結合: 近接するパーティクル同士を線で結ぶ
  - パフォーマンス: rAF, 解像度スケーリング, 距離計算の最適化
*/

(() => {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d', { alpha: true });

  // ウィンドウサイズに応じてキャンバスを更新
  let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  const resize = () => {
    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // パーティクル設定（端末負荷に応じて数を調整）
  const baseCount = width < 600 ? 90 : 140; // モバイルで少なめ
  const particles = [];
  const mouse = { x: width / 2, y: height / 2, active: false };
  const linkDist = 120; // 線で結ぶ距離しきい値
  const linkDistSq = linkDist * linkDist; // 距離の二乗で比較

  // 乱数ユーティリティ
  const rand = (min, max) => Math.random() * (max - min) + min;

  // パーティクル生成
  for (let i = 0; i < baseCount; i++) {
    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.35, 0.35),
      vy: rand(-0.35, 0.35),
      r: rand(1.0, 2.2), // 半径
      hue: rand(190, 220), // 青系の色相
    });
  }

  // マウスイベント（pointer 系で統一）
  window.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    mouse.active = false;
  }, { passive: true });

  // 年表示
  document.getElementById('year').textContent = String(new Date().getFullYear());

  // アニメーションループ
  const step = () => {
    // 背景の軽いフェードでトレイル感を演出
    ctx.clearRect(0, 0, width, height);

    // パーティクル更新
    for (let p of particles) {
      // マウスに引かれる軽い力
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const influence = distSq > 0 ? Math.min(80_000 / distSq, 0.08) : 0; // 過度な加速を抑制
        p.vx += dx * influence * 0.002;
        p.vy += dy * influence * 0.002;
      }

      // 速度の減衰（安定化）
      p.vx *= 0.995;
      p.vy *= 0.995;

      // 位置更新
      p.x += p.vx;
      p.y += p.vy;

      // 端でバウンス
      if (p.x < 0 || p.x > width) p.vx *= -1, p.x = Math.max(0, Math.min(width, p.x));
      if (p.y < 0 || p.y > height) p.vy *= -1, p.y = Math.max(0, Math.min(height, p.y));
    }

    // 線結合（二乗距離で比較して高速化）
    ctx.lineWidth = 0.8;
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkDistSq) {
          const alpha = 1 - d2 / linkDistSq; // 近いほど濃く
          ctx.strokeStyle = `rgba(180, 220, 255, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // パーティクル描画
    for (let p of particles) {
      ctx.fillStyle = `hsl(${p.hue}, 80%, 70%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);

  // パフォーマンス最適化: タブが非アクティブなときは更新を抑制
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // 簡易的に速度を減衰させて停止に近づける
      for (let p of particles) { p.vx *= 0.9; p.vy *= 0.9; }
    }
  });
})();