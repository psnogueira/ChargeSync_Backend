const db = require('../db/database');

// Função para listar todas as sessões de recarga com informações de usuários e estações
exports.getCharges = (req, res) => {
  const { status, progress } = req.query; // Parâmetros de filtro opcionais

  // Montar a consulta SQL com as junções
  let sql = "SELECT * FROM charges";

  // Array de condições para filtros opcionais
  const conditions = [];
  const params = [];

  // Adicionar filtros de status ou progresso se fornecidos
  if (status) {
    conditions.push('charges.status = ?');
    params.push(status);
  }

  if (progress !== undefined) {
    conditions.push('charges.progress = ?');
    params.push(progress);
  }

  // Se existirem condições, adiciona cláusulas WHERE
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  // Executa a consulta no banco de dados
  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Verifica se há registros retornados
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nenhuma sessão de recarga encontrada' });
    }

    res.json({
      message: 'Sucesso',
      data: rows
    });
  });
};

// Função para obter uma sessão de recarga específica pelo ID
exports.getChargeById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT * FROM charges
    WHERE charges.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Sessão de recarga não encontrada' });
    }
    res.json({
      message: 'Sucesso',
      data: row
    });
  });
};

// Função para obter todas as sessões de recarga de um usuário específico pelo ID do usuário
exports.getChargesByUserId = (req, res) => {
    const { userId } = req.params;
    const sql = `
      SELECT * FROM charges
      WHERE charges.userId = ?
    `;
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Nenhuma sessão de recarga encontrada para este usuário' });
      }
      res.json({
        message: 'Sucesso',
        data: rows
      });
    });
};

// Função para obter o histórico de recargas de um usuário (somente sessões concluídas)
exports.getChargeHistoryByUserId = (req, res) => {
  const { userId } = req.params;  // Pegando o userId dos parâmetros da URL
  const sql = `
    SELECT * FROM charges 
    WHERE userId = ? 
    AND end_time IS NOT NULL
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nenhuma sessão de recarga concluída encontrada para este usuário' });
    }
    res.json({
      message: 'Sucesso',
      data: rows
    });
  });
};

// Função para criar uma nova sessão de recarga
exports.createCharge = (req, res) => {
  const { userId, stationId, start_time, status } = req.body;

  // Verificações básicas de validação
  if (!userId || !stationId || !start_time || !status) {
    return res.status(400).json({ message: 'Todos os campos userId, stationId, start_time e status são obrigatórios.' });
  }

  // Inserir a nova sessão de recarga com progress inicial 0 e end_time como NULL
  const sql = `
    INSERT INTO charges (userId, stationId, start_time, status, progress, end_time) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [userId, stationId, start_time, status, 0, null]; // Progress começa em 0, end_time é NULL

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Sessão de recarga criada com sucesso',
      data: { 
        id: this.lastID, 
        userId, 
        stationId, 
        start_time, 
        status, 
        progress: 0,
        end_time: null
      }
    });
  });
};

// Atualiza uma sessão de recarga existente
exports.updateCharge = (req, res) => {
  const { id } = req.params;
  const { progress, status, start_time, end_time, energy_used, stationId } = req.body;

  // Array para armazenar as colunas a serem atualizadas dinamicamente
  let updates = [];
  let params = [];

  // Atualiza o progresso, se fornecido
  if (progress !== undefined) {
    // Limitar o progresso a no máximo 100%
    const newProgress = progress > 100 ? 100 : progress;
    updates.push('progress = ?');
    params.push(newProgress);

    // Se o progresso atingir 100%, também atualizamos o status para "concluído" e definimos o end_time
    if (newProgress === 100) {
      updates.push('status = ?');
      params.push('concluído');
      updates.push('end_time = ?');
      params.push(new Date().toISOString());  // Definindo o horário atual no formato ISO
    }
  }

  // Atualiza o status, se fornecido (se o progresso for 100%, já o atualizamos para "concluído")
  if (status !== undefined && progress !== 100) {
    updates.push('status = ?');
    params.push(status);
  }

  // Atualiza outros campos, se fornecidos
  if (start_time !== undefined) {
    updates.push('start_time = ?');
    params.push(start_time);
  }

  if (end_time !== undefined && progress !== 100) {
    updates.push('end_time = ?');
    params.push(end_time);
  }

  if (energy_used !== undefined) {
    updates.push('energy_used = ?');
    params.push(energy_used);
  }

  if (stationId !== undefined) {
    updates.push('stationId = ?');
    params.push(stationId);
  }

  // Se não há campos para atualizar, retornamos um erro
  if (updates.length === 0) {
    return res.status(400).json({ message: 'Nenhum campo válido para atualizar' });
  }

  // Criar a query dinamicamente
  const sql = `
    UPDATE charges
    SET ${updates.join(', ')}
    WHERE id = ?
  `;
  params.push(id);

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Sessão de recarga não encontrada' });
    }
    res.json({ message: 'Sessão de recarga atualizada com sucesso' });
  });
};

// Atualiza o progresso da sessão de recarga
exports.updateChargeProgress = (req, res) => {
  const { chargeId } = req.params;
  let { progress } = req.body;

  // Limitar o progresso a no máximo 100%
  if (progress > 100) {
    progress = 100;
  }

  // Se o progresso for 100%, também atualizamos o status para "concluído" e definimos o end_time
  if (progress === 100) {
    const endTime = new Date().toISOString(); // Horário atual no formato ISO
    const sql = `
      UPDATE charges
      SET progress = ?, status = 'concluído', end_time = ?
      WHERE id = ?
    `;
    const params = [progress, endTime, chargeId];

    db.run(sql, params, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Sessão de recarga não encontrada' });
      }
      res.json({ 
        message: 'Recarga concluída com sucesso', 
        progress: 100, 
        status: 'concluído', 
        end_time: endTime 
      });
    });
  } else {
    // Se o progresso for menor que 100%, apenas atualizamos o progresso
    const sql = `
      UPDATE charges
      SET progress = ?
      WHERE id = ?
    `;
    const params = [progress, chargeId];

    db.run(sql, params, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Sessão de recarga não encontrada' });
      }
      res.json({ 
        message: 'Progresso da recarga atualizado com sucesso', 
        progress 
      });
    });
  }
};

// Função para deletar uma sessão de recarga
exports.deleteCharge = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM charges WHERE id = ?';

  db.run(sql, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Sessão de recarga não encontrada' });
    }
    res.json({
      message: 'Sessão de recarga deletada com sucesso'
    });
  });
};